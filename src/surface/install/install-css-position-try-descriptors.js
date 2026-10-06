import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  CSSPositionTryDescriptors,
  createPositionDescriptorGetter,
  descriptorProperties,
  installCSSPositionTryDescriptorsConstructor,
} from "../api/css/css-position-try-descriptors.js";

export function installCSSPositionTryDescriptors() {
  installCSSPositionTryDescriptorsConstructor();

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin"),
      createPositionDescriptorGetter("margin"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginTop"),
      createPositionDescriptorGetter("marginTop"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginRight"),
      createPositionDescriptorGetter("marginRight"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginBottom"),
      createPositionDescriptorGetter("marginBottom"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginLeft"),
      createPositionDescriptorGetter("marginLeft"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginBlock"),
      createPositionDescriptorGetter("marginBlock"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginBlockStart"),
      createPositionDescriptorGetter("marginBlockStart"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginBlockEnd"),
      createPositionDescriptorGetter("marginBlockEnd"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginInline"),
      createPositionDescriptorGetter("marginInline"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginInlineStart"),
      createPositionDescriptorGetter("marginInlineStart"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("marginInlineEnd"),
      createPositionDescriptorGetter("marginInlineEnd"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-top"),
      createPositionDescriptorGetter("margin-top"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-right"),
      createPositionDescriptorGetter("margin-right"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-bottom"),
      createPositionDescriptorGetter("margin-bottom"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-left"),
      createPositionDescriptorGetter("margin-left"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-block"),
      createPositionDescriptorGetter("margin-block"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-block-start"),
      createPositionDescriptorGetter("margin-block-start"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-block-end"),
      createPositionDescriptorGetter("margin-block-end"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-inline"),
      createPositionDescriptorGetter("margin-inline"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-inline-start"),
      createPositionDescriptorGetter("margin-inline-start"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("margin-inline-end"),
      createPositionDescriptorGetter("margin-inline-end"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("inset"),
      createPositionDescriptorGetter("inset"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("insetBlock"),
      createPositionDescriptorGetter("insetBlock"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("insetBlockStart"),
      createPositionDescriptorGetter("insetBlockStart"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("insetBlockEnd"),
      createPositionDescriptorGetter("insetBlockEnd"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("insetInline"),
      createPositionDescriptorGetter("insetInline"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("insetInlineStart"),
      createPositionDescriptorGetter("insetInlineStart"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("insetInlineEnd"),
      createPositionDescriptorGetter("insetInlineEnd"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("top"),
      createPositionDescriptorGetter("top"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("left"),
      createPositionDescriptorGetter("left"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("right"),
      createPositionDescriptorGetter("right"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("bottom"),
      createPositionDescriptorGetter("bottom"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("inset-block"),
      createPositionDescriptorGetter("inset-block"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("inset-block-start"),
      createPositionDescriptorGetter("inset-block-start"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("inset-block-end"),
      createPositionDescriptorGetter("inset-block-end"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("inset-inline"),
      createPositionDescriptorGetter("inset-inline"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("inset-inline-start"),
      createPositionDescriptorGetter("inset-inline-start"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("inset-inline-end"),
      createPositionDescriptorGetter("inset-inline-end"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("width"),
      createPositionDescriptorGetter("width"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("minWidth"),
      createPositionDescriptorGetter("minWidth"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("maxWidth"),
      createPositionDescriptorGetter("maxWidth"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("height"),
      createPositionDescriptorGetter("height"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("minHeight"),
      createPositionDescriptorGetter("minHeight"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("maxHeight"),
      createPositionDescriptorGetter("maxHeight"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("blockSize"),
      createPositionDescriptorGetter("blockSize"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("minBlockSize"),
      createPositionDescriptorGetter("minBlockSize"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("maxBlockSize"),
      createPositionDescriptorGetter("maxBlockSize"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("inlineSize"),
      createPositionDescriptorGetter("inlineSize"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("minInlineSize"),
      createPositionDescriptorGetter("minInlineSize"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("maxInlineSize"),
      createPositionDescriptorGetter("maxInlineSize"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("min-width"),
      createPositionDescriptorGetter("min-width"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("max-width"),
      createPositionDescriptorGetter("max-width"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("min-height"),
      createPositionDescriptorGetter("min-height"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("max-height"),
      createPositionDescriptorGetter("max-height"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("block-size"),
      createPositionDescriptorGetter("block-size"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("min-block-size"),
      createPositionDescriptorGetter("min-block-size"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("max-block-size"),
      createPositionDescriptorGetter("max-block-size"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("inline-size"),
      createPositionDescriptorGetter("inline-size"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("min-inline-size"),
      createPositionDescriptorGetter("min-inline-size"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("max-inline-size"),
      createPositionDescriptorGetter("max-inline-size"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("placeSelf"),
      createPositionDescriptorGetter("placeSelf"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("alignSelf"),
      createPositionDescriptorGetter("alignSelf"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("justifySelf"),
      createPositionDescriptorGetter("justifySelf"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("place-self"),
      createPositionDescriptorGetter("place-self"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("align-self"),
      createPositionDescriptorGetter("align-self"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("justify-self"),
      createPositionDescriptorGetter("justify-self"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("positionAnchor"),
      createPositionDescriptorGetter("positionAnchor"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("position-anchor"),
      createPositionDescriptorGetter("position-anchor"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("positionArea"),
      createPositionDescriptorGetter("positionArea"),
    );

    definePrototypeGetter(
      CSSPositionTryDescriptors.prototype,
      ("position-area"),
      createPositionDescriptorGetter("position-area"),
    );

  defineConstructorBacklink(CSSPositionTryDescriptors.prototype, CSSPositionTryDescriptors);
  defineToStringTag(CSSPositionTryDescriptors.prototype, "CSSPositionTryDescriptors");
}
