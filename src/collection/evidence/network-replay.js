/**
 * Network Replay System
 * 
 * 负责从 Evidence Bundle 中 replay 网络请求
 */

/**
 * 请求匹配策略
 */
export const MATCH_STRATEGY = {
  METHOD_URL: 'method-url',                      // 只匹配 method + URL
  METHOD_URL_BODY: 'method-url-body',            // 匹配 method + URL + body
  METHOD_URL_BODY_SHA256: 'method-url-body-sha256', // 匹配 method + URL + body SHA-256
  EXACT: 'exact',                                // 精确匹配（包括所有 headers）
};

/**
 * Replay 结果类型
 */
export const REPLAY_RESULT = {
  MATCHED: 'matched',           // 匹配成功
  NOT_FOUND: 'not-found',       // 未找到匹配
  EXHAUSTED: 'exhausted',       // 匹配项已耗尽
  SEQUENCE_ERROR: 'sequence-error', // 顺序错误
  BODY_MISMATCH: 'body-mismatch',   // Body 不匹配
};

/**
 * Network Replay 系统
 */
export class NetworkReplay {
  constructor(replayFixture, evidenceBundle, options = {}) {
    this.fixture = replayFixture;
    this.bundle = evidenceBundle;
    this.strategy = options.strategy || this.fixture?.matching || MATCH_STRATEGY.METHOD_URL_BODY_SHA256;
    this.enforceSequence = options.enforceSequence || false;
    
    // 请求记录索引
    this.records = new Map(); // id -> record
    this.recordsByUrl = new Map(); // URL -> [records]
    this.usageCount = new Map(); // id -> count
    this.sequence = 0;
    
    // Replay 历史
    this.history = [];
    
    // 初始化索引
    this.buildIndex();
  }
  
  /**
   * 构建索引
   */
  buildIndex() {
    if (!this.fixture || !Array.isArray(this.fixture.requests)) {
      return;
    }
    
    for (const record of this.fixture.requests) {
      if (!record.id || !record.request) {
        continue;
      }
      
      this.records.set(record.id, record);
      this.usageCount.set(record.id, 0);
      
      // 按 URL 索引
      const url = record.request.url;
      if (!this.recordsByUrl.has(url)) {
        this.recordsByUrl.set(url, []);
      }
      this.recordsByUrl.get(url).push(record);
    }
  }
  
  /**
   * 匹配请求
   * 
   * @param {Object} request - 请求对象 { method, url, headers, body }
   * @returns {Promise<Object>} - { result, response, record }
   */
  async match(request) {
    const { method, url, headers, body } = request;
    
    // 查找候选记录
    const candidates = this.recordsByUrl.get(url) || [];
    
    if (candidates.length === 0) {
      return this.recordResult(REPLAY_RESULT.NOT_FOUND, request, null);
    }
    
    // 按策略匹配
    let sawExhausted = false;
    for (const record of candidates) {
      const matched = await this.matchRecord(request, record);
      
      if (matched) {
        // 检查是否已耗尽
        const repeat = record.repeat || 'once';
        const count = this.usageCount.get(record.id);
        
        if (repeat === 'once' && count >= 1) {
          sawExhausted = true;
          continue; // 已使用，跳过
        } else if (typeof repeat === 'number' && count >= repeat) {
          sawExhausted = true;
          continue; // 已耗尽
        }
        
        // 检查顺序
        if (this.enforceSequence && record.sequence !== undefined) {
          if (record.sequence !== this.sequence) {
            return this.recordResult(REPLAY_RESULT.SEQUENCE_ERROR, request, record);
          }
          this.sequence++;
        }
        
        // 匹配成功
        this.usageCount.set(record.id, count + 1);
        const response = await this.buildResponse(record.response);
        return this.recordResult(REPLAY_RESULT.MATCHED, request, record, response);
      }
    }
    
    // 区分“有候选但全部耗尽”与“压根没匹配”：前者返回 EXHAUSTED（否则
    // REPLAY_RESULT.EXHAUSTED 永不产生，getStats().exhausted 恒为 0）。
    if (sawExhausted) {
      return this.recordResult(REPLAY_RESULT.EXHAUSTED, request, null);
    }
    // 未找到匹配
    return this.recordResult(REPLAY_RESULT.NOT_FOUND, request, null);
  }
  
  /**
   * 匹配单条记录
   */
  async matchRecord(request, record) {
    const { method, url, headers, body } = request;
    const recordReq = record.request;
    
    // 匹配 method
    if (recordReq.method !== method) {
      return false;
    }
    
    // 匹配 URL
    if (recordReq.url !== url) {
      return false;
    }
    
    // 根据策略匹配
    if (this.strategy === MATCH_STRATEGY.METHOD_URL) {
      return true;
    }
    
    if (this.strategy === MATCH_STRATEGY.METHOD_URL_BODY) {
      // 精确匹配 body
      return this.compareBody(body, recordReq.body);
    }
    
    if (this.strategy === MATCH_STRATEGY.METHOD_URL_BODY_SHA256) {
      // 匹配 body SHA-256
      if (recordReq.bodySha256) {
        const actualSha256 = await this.computeBodySha256(body);
        return actualSha256 === recordReq.bodySha256;
      }
      // 回退到精确匹配
      return this.compareBody(body, recordReq.body);
    }
    
    if (this.strategy === MATCH_STRATEGY.EXACT) {
      // 精确匹配所有内容
      const headersMatch = this.compareHeaders(headers, recordReq.headers);
      const bodyMatch = this.compareBody(body, recordReq.body);
      return headersMatch && bodyMatch;
    }
    
    return false;
  }
  
  /**
   * 比较 body
   */
  compareBody(actual, expected) {
    if (actual === expected) {
      return true;
    }
    
    if (actual == null && expected == null) {
      return true;
    }
    
    if (typeof actual === 'string' && typeof expected === 'string') {
      return actual === expected;
    }
    
    // Buffer 或其他类型
    if (Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
      return actual.equals(expected);
    }
    
    return false;
  }
  
  /**
   * 比较 headers
   */
  compareHeaders(actual, expected) {
    if (!Array.isArray(expected)) {
      return true; // 没有期望的 headers
    }
    
    const actualMap = new Map();
    if (Array.isArray(actual)) {
      for (const { name, value } of actual) {
        actualMap.set(name.toLowerCase(), value);
      }
    } else if (actual && typeof actual === 'object') {
      for (const [name, value] of Object.entries(actual)) {
        actualMap.set(name.toLowerCase(), value);
      }
    }
    
    for (const { name, value } of expected) {
      const actualValue = actualMap.get(name.toLowerCase());
      if (actualValue !== value) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * 计算 body SHA-256
   */
  async computeBodySha256(body) {
    const crypto = await import('crypto');
    const hash = crypto.createHash('sha256');
    
    if (typeof body === 'string') {
      hash.update(body, 'utf8');
    } else if (Buffer.isBuffer(body)) {
      hash.update(body);
    } else if (body != null) {
      hash.update(JSON.stringify(body));
    }
    
    return hash.digest('hex');
  }
  
  /**
   * 构建响应对象
   */
  async buildResponse(responseSpec) {
    const response = {
      status: responseSpec.status || 200,
      statusText: responseSpec.statusText || 'OK',
      headers: responseSpec.headers || [],
    };
    
    // 读取 body
    if (responseSpec.bodyFile) {
      response.body = await this.bundle.readFileBuffer(responseSpec.bodyFile);
    } else if (responseSpec.body !== undefined) {
      response.body = responseSpec.body;
    }
    
    return response;
  }
  
  /**
   * 记录 replay 结果
   */
  recordResult(result, request, record, response = null) {
    const entry = {
      timestamp: new Date().toISOString(),
      result,
      request: {
        method: request.method,
        url: request.url,
      },
      recordId: record?.id || null,
      response: response ? {
        status: response.status,
        statusText: response.statusText,
      } : null,
    };
    
    this.history.push(entry);
    
    return {
      result,
      response,
      record,
    };
  }
  
  /**
   * 获取 replay 历史
   */
  getHistory() {
    return this.history;
  }
  
  /**
   * 获取统计信息
   */
  getStats() {
    const total = this.history.length;
    const matched = this.history.filter(h => h.result === REPLAY_RESULT.MATCHED).length;
    const notFound = this.history.filter(h => h.result === REPLAY_RESULT.NOT_FOUND).length;
    const exhausted = this.history.filter(h => h.result === REPLAY_RESULT.EXHAUSTED).length;
    
    return {
      total,
      matched,
      notFound,
      exhausted,
      matchRate: total > 0 ? matched / total : 0,
    };
  }
  
  /**
   * 清理
   */
  dispose() {
    this.records.clear();
    this.recordsByUrl.clear();
    this.usageCount.clear();
    this.history = [];
  }
}

/**
 * 创建 Network Replay 实例
 */
export async function createNetworkReplay(evidenceBundle, options = {}) {
  const fixture = await evidenceBundle.getNetworkReplay();
  
  if (!fixture) {
    return null;
  }
  
  return new NetworkReplay(fixture, evidenceBundle, options);
}
