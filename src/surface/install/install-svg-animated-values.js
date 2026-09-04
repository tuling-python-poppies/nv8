import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  animatedConstructors,
  createAnimatedGetter,
  installSVGAnimatedValueConstructors,
} from "../api/svg/svg-animated-values.js";

export function installSVGAnimatedValues() {
  installSVGAnimatedValueConstructors();
  do {
    definePrototypeGetter(
      (((animatedConstructors)[0])).prototype,
      "baseVal",
      createAnimatedGetter((((animatedConstructors)[0])).name, "baseVal"),
    );
    definePrototypeGetter(
      (((animatedConstructors)[0])).prototype,
      "animVal",
      createAnimatedGetter((((animatedConstructors)[0])).name, "animVal"),
    );
    defineConstructorBacklink((((animatedConstructors)[0])).prototype, (((animatedConstructors)[0])));
    defineToStringTag((((animatedConstructors)[0])).prototype, (((animatedConstructors)[0])).name);
  } while (false);
do {
    definePrototypeGetter(
      (((animatedConstructors)[1])).prototype,
      "baseVal",
      createAnimatedGetter((((animatedConstructors)[1])).name, "baseVal"),
    );
    definePrototypeGetter(
      (((animatedConstructors)[1])).prototype,
      "animVal",
      createAnimatedGetter((((animatedConstructors)[1])).name, "animVal"),
    );
    defineConstructorBacklink((((animatedConstructors)[1])).prototype, (((animatedConstructors)[1])));
    defineToStringTag((((animatedConstructors)[1])).prototype, (((animatedConstructors)[1])).name);
  } while (false);
do {
    definePrototypeGetter(
      (((animatedConstructors)[2])).prototype,
      "baseVal",
      createAnimatedGetter((((animatedConstructors)[2])).name, "baseVal"),
    );
    definePrototypeGetter(
      (((animatedConstructors)[2])).prototype,
      "animVal",
      createAnimatedGetter((((animatedConstructors)[2])).name, "animVal"),
    );
    defineConstructorBacklink((((animatedConstructors)[2])).prototype, (((animatedConstructors)[2])));
    defineToStringTag((((animatedConstructors)[2])).prototype, (((animatedConstructors)[2])).name);
  } while (false);
do {
    definePrototypeGetter(
      (((animatedConstructors)[3])).prototype,
      "baseVal",
      createAnimatedGetter((((animatedConstructors)[3])).name, "baseVal"),
    );
    definePrototypeGetter(
      (((animatedConstructors)[3])).prototype,
      "animVal",
      createAnimatedGetter((((animatedConstructors)[3])).name, "animVal"),
    );
    defineConstructorBacklink((((animatedConstructors)[3])).prototype, (((animatedConstructors)[3])));
    defineToStringTag((((animatedConstructors)[3])).prototype, (((animatedConstructors)[3])).name);
  } while (false);
do {
    definePrototypeGetter(
      (((animatedConstructors)[4])).prototype,
      "baseVal",
      createAnimatedGetter((((animatedConstructors)[4])).name, "baseVal"),
    );
    definePrototypeGetter(
      (((animatedConstructors)[4])).prototype,
      "animVal",
      createAnimatedGetter((((animatedConstructors)[4])).name, "animVal"),
    );
    defineConstructorBacklink((((animatedConstructors)[4])).prototype, (((animatedConstructors)[4])));
    defineToStringTag((((animatedConstructors)[4])).prototype, (((animatedConstructors)[4])).name);
  } while (false);
do {
    definePrototypeGetter(
      (((animatedConstructors)[5])).prototype,
      "baseVal",
      createAnimatedGetter((((animatedConstructors)[5])).name, "baseVal"),
    );
    definePrototypeGetter(
      (((animatedConstructors)[5])).prototype,
      "animVal",
      createAnimatedGetter((((animatedConstructors)[5])).name, "animVal"),
    );
    defineConstructorBacklink((((animatedConstructors)[5])).prototype, (((animatedConstructors)[5])));
    defineToStringTag((((animatedConstructors)[5])).prototype, (((animatedConstructors)[5])).name);
  } while (false);
do {
    definePrototypeGetter(
      (((animatedConstructors)[6])).prototype,
      "baseVal",
      createAnimatedGetter((((animatedConstructors)[6])).name, "baseVal"),
    );
    definePrototypeGetter(
      (((animatedConstructors)[6])).prototype,
      "animVal",
      createAnimatedGetter((((animatedConstructors)[6])).name, "animVal"),
    );
    defineConstructorBacklink((((animatedConstructors)[6])).prototype, (((animatedConstructors)[6])));
    defineToStringTag((((animatedConstructors)[6])).prototype, (((animatedConstructors)[6])).name);
  } while (false);
do {
    definePrototypeGetter(
      (((animatedConstructors)[7])).prototype,
      "baseVal",
      createAnimatedGetter((((animatedConstructors)[7])).name, "baseVal"),
    );
    definePrototypeGetter(
      (((animatedConstructors)[7])).prototype,
      "animVal",
      createAnimatedGetter((((animatedConstructors)[7])).name, "animVal"),
    );
    defineConstructorBacklink((((animatedConstructors)[7])).prototype, (((animatedConstructors)[7])));
    defineToStringTag((((animatedConstructors)[7])).prototype, (((animatedConstructors)[7])).name);
  } while (false);
do {
    definePrototypeGetter(
      (((animatedConstructors)[8])).prototype,
      "baseVal",
      createAnimatedGetter((((animatedConstructors)[8])).name, "baseVal"),
    );
    definePrototypeGetter(
      (((animatedConstructors)[8])).prototype,
      "animVal",
      createAnimatedGetter((((animatedConstructors)[8])).name, "animVal"),
    );
    defineConstructorBacklink((((animatedConstructors)[8])).prototype, (((animatedConstructors)[8])));
    defineToStringTag((((animatedConstructors)[8])).prototype, (((animatedConstructors)[8])).name);
  } while (false);
do {
    definePrototypeGetter(
      (((animatedConstructors)[9])).prototype,
      "baseVal",
      createAnimatedGetter((((animatedConstructors)[9])).name, "baseVal"),
    );
    definePrototypeGetter(
      (((animatedConstructors)[9])).prototype,
      "animVal",
      createAnimatedGetter((((animatedConstructors)[9])).name, "animVal"),
    );
    defineConstructorBacklink((((animatedConstructors)[9])).prototype, (((animatedConstructors)[9])));
    defineToStringTag((((animatedConstructors)[9])).prototype, (((animatedConstructors)[9])).name);
  } while (false);
do {
    definePrototypeGetter(
      (((animatedConstructors)[10])).prototype,
      "baseVal",
      createAnimatedGetter((((animatedConstructors)[10])).name, "baseVal"),
    );
    definePrototypeGetter(
      (((animatedConstructors)[10])).prototype,
      "animVal",
      createAnimatedGetter((((animatedConstructors)[10])).name, "animVal"),
    );
    defineConstructorBacklink((((animatedConstructors)[10])).prototype, (((animatedConstructors)[10])));
    defineToStringTag((((animatedConstructors)[10])).prototype, (((animatedConstructors)[10])).name);
  } while (false);
do {
    definePrototypeGetter(
      (((animatedConstructors)[11])).prototype,
      "baseVal",
      createAnimatedGetter((((animatedConstructors)[11])).name, "baseVal"),
    );
    definePrototypeGetter(
      (((animatedConstructors)[11])).prototype,
      "animVal",
      createAnimatedGetter((((animatedConstructors)[11])).name, "animVal"),
    );
    defineConstructorBacklink((((animatedConstructors)[11])).prototype, (((animatedConstructors)[11])));
    defineToStringTag((((animatedConstructors)[11])).prototype, (((animatedConstructors)[11])).name);
  } while (false);
}
