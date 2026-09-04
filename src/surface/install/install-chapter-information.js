import * as runtime from "../api/chapter-information/chapter-information-runtime.js";
import {
  CHAPTER_INFORMATION_SURFACE,
} from "../api/chapter-information/chapter-information-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../engine/webidl/native-function.js";

export function installChapterInformation() {
  delete runtime.ChapterInformation.prototype.constructor;
  defineGlobalConstructor("ChapterInformation", runtime.ChapterInformation);
  do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("title")]() {
          return runtime.chapterInformationProperty(this, ("title"));
        },
      }, ("title")).get;
      registerNativeGetter(getter, ("title"));
      definePrototypeGetter(
        runtime.ChapterInformation.prototype,
        ("title"),
        getter,
      );
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("startTime")]() {
          return runtime.chapterInformationProperty(this, ("startTime"));
        },
      }, ("startTime")).get;
      registerNativeGetter(getter, ("startTime"));
      definePrototypeGetter(
        runtime.ChapterInformation.prototype,
        ("startTime"),
        getter,
      );
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("artwork")]() {
          return runtime.chapterInformationProperty(this, ("artwork"));
        },
      }, ("artwork")).get;
      registerNativeGetter(getter, ("artwork"));
      definePrototypeGetter(
        runtime.ChapterInformation.prototype,
        ("artwork"),
        getter,
      );
    }
  } while (false);
do {
    {
      defineConstructorBacklink(
        runtime.ChapterInformation.prototype,
        runtime.ChapterInformation,
      );
    }
  } while (false);
do {
    {
      defineToStringTag(
        runtime.ChapterInformation.prototype,
        "ChapterInformation",
      );
    }
  } while (false);
}
