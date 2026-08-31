import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  CSSPositionTryDescriptors,
  createPositionDescriptorGetter,
  descriptorProperties,
  installCSSPositionTryDescriptorsConstructor,
} from "../api/css/css-position-try-descriptors.js";

export function installCSSPositionTryDescriptors() {
  installCSSPositionTryDescriptorsConstructor();
  do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin"),
      createPositionDescriptorGetter(("margin")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginTop"),
      createPositionDescriptorGetter(("marginTop")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginRight"),
      createPositionDescriptorGetter(("marginRight")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginBottom"),
      createPositionDescriptorGetter(("marginBottom")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginLeft"),
      createPositionDescriptorGetter(("marginLeft")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginBlock"),
      createPositionDescriptorGetter(("marginBlock")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginBlockStart"),
      createPositionDescriptorGetter(("marginBlockStart")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginBlockEnd"),
      createPositionDescriptorGetter(("marginBlockEnd")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginInline"),
      createPositionDescriptorGetter(("marginInline")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginInlineStart"),
      createPositionDescriptorGetter(("marginInlineStart")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginInlineEnd"),
      createPositionDescriptorGetter(("marginInlineEnd")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-top"),
      createPositionDescriptorGetter(("margin-top")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-right"),
      createPositionDescriptorGetter(("margin-right")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-bottom"),
      createPositionDescriptorGetter(("margin-bottom")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-left"),
      createPositionDescriptorGetter(("margin-left")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-block"),
      createPositionDescriptorGetter(("margin-block")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-block-start"),
      createPositionDescriptorGetter(("margin-block-start")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-block-end"),
      createPositionDescriptorGetter(("margin-block-end")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-inline"),
      createPositionDescriptorGetter(("margin-inline")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-inline-start"),
      createPositionDescriptorGetter(("margin-inline-start")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-inline-end"),
      createPositionDescriptorGetter(("margin-inline-end")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("inset"),
      createPositionDescriptorGetter(("inset")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("insetBlock"),
      createPositionDescriptorGetter(("insetBlock")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("insetBlockStart"),
      createPositionDescriptorGetter(("insetBlockStart")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("insetBlockEnd"),
      createPositionDescriptorGetter(("insetBlockEnd")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("insetInline"),
      createPositionDescriptorGetter(("insetInline")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("insetInlineStart"),
      createPositionDescriptorGetter(("insetInlineStart")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("insetInlineEnd"),
      createPositionDescriptorGetter(("insetInlineEnd")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("top"),
      createPositionDescriptorGetter(("top")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("left"),
      createPositionDescriptorGetter(("left")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("right"),
      createPositionDescriptorGetter(("right")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("bottom"),
      createPositionDescriptorGetter(("bottom")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("inset-block"),
      createPositionDescriptorGetter(("inset-block")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("inset-block-start"),
      createPositionDescriptorGetter(("inset-block-start")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("inset-block-end"),
      createPositionDescriptorGetter(("inset-block-end")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("inset-inline"),
      createPositionDescriptorGetter(("inset-inline")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("inset-inline-start"),
      createPositionDescriptorGetter(("inset-inline-start")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("inset-inline-end"),
      createPositionDescriptorGetter(("inset-inline-end")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("width"),
      createPositionDescriptorGetter(("width")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("minWidth"),
      createPositionDescriptorGetter(("minWidth")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("maxWidth"),
      createPositionDescriptorGetter(("maxWidth")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("height"),
      createPositionDescriptorGetter(("height")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("minHeight"),
      createPositionDescriptorGetter(("minHeight")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("maxHeight"),
      createPositionDescriptorGetter(("maxHeight")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("blockSize"),
      createPositionDescriptorGetter(("blockSize")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("minBlockSize"),
      createPositionDescriptorGetter(("minBlockSize")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("maxBlockSize"),
      createPositionDescriptorGetter(("maxBlockSize")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("inlineSize"),
      createPositionDescriptorGetter(("inlineSize")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("minInlineSize"),
      createPositionDescriptorGetter(("minInlineSize")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("maxInlineSize"),
      createPositionDescriptorGetter(("maxInlineSize")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("min-width"),
      createPositionDescriptorGetter(("min-width")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("max-width"),
      createPositionDescriptorGetter(("max-width")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("min-height"),
      createPositionDescriptorGetter(("min-height")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("max-height"),
      createPositionDescriptorGetter(("max-height")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("block-size"),
      createPositionDescriptorGetter(("block-size")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("min-block-size"),
      createPositionDescriptorGetter(("min-block-size")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("max-block-size"),
      createPositionDescriptorGetter(("max-block-size")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("inline-size"),
      createPositionDescriptorGetter(("inline-size")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("min-inline-size"),
      createPositionDescriptorGetter(("min-inline-size")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("max-inline-size"),
      createPositionDescriptorGetter(("max-inline-size")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("placeSelf"),
      createPositionDescriptorGetter(("placeSelf")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("alignSelf"),
      createPositionDescriptorGetter(("alignSelf")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("justifySelf"),
      createPositionDescriptorGetter(("justifySelf")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("place-self"),
      createPositionDescriptorGetter(("place-self")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("align-self"),
      createPositionDescriptorGetter(("align-self")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("justify-self"),
      createPositionDescriptorGetter(("justify-self")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("positionAnchor"),
      createPositionDescriptorGetter(("positionAnchor")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("position-anchor"),
      createPositionDescriptorGetter(("position-anchor")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("positionArea"),
      createPositionDescriptorGetter(("positionArea")),
    );
  } while (false);
do {
    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("position-area"),
      createPositionDescriptorGetter(("position-area")),
    );
  } while (false);
  defineConstructorBacklink(CSSPositionTryDescriptors.prototype, CSSPositionTryDescriptors);
  defineToStringTag(CSSPositionTryDescriptors.prototype, "CSSPositionTryDescriptors");
}
