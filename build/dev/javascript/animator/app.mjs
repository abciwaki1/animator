//# sourceMappingURL=app.mjs.map
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import * as $string from "../gleam_stdlib/gleam/string.mjs";
import * as $lustre from "../lustre/lustre.mjs";
import * as $attr from "../lustre/lustre/attribute.mjs";
import * as $effect from "../lustre/lustre/effect.mjs";
import * as $element from "../lustre/lustre/element.mjs";
import * as $html from "../lustre/lustre/element/html.mjs";
import * as $event from "../lustre/lustre/event.mjs";
import * as $builtins from "./builtins.mjs";
import * as $drawing from "./drawing.mjs";
import * as $editor from "./editor.mjs";
import * as $errors from "./errors.mjs";
import * as $examples from "./examples.mjs";
import {
  Ok,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
  makeError,
} from "./gleam.mjs";
import * as $parser from "./parser.mjs";
import * as $render from "./render.mjs";
import * as $shape from "./shape.mjs";

const FILEPATH = "src/app.gleam";

export class Model extends $CustomType {
  constructor(source, code_open, output, shape_value, speed_value) {
    super();
    this.source = source;
    this.code_open = code_open;
    this.output = output;
    this.shape_value = shape_value;
    this.speed_value = speed_value;
  }
}
export const Model$Model = (source, code_open, output, shape_value, speed_value) =>
  new Model(source, code_open, output, shape_value, speed_value);
export const Model$isModel = (value) => value instanceof Model;
export const Model$Model$source = (value) => value.source;
export const Model$Model$0 = (value) => value.source;
export const Model$Model$code_open = (value) => value.code_open;
export const Model$Model$1 = (value) => value.code_open;
export const Model$Model$output = (value) => value.output;
export const Model$Model$2 = (value) => value.output;
export const Model$Model$shape_value = (value) => value.shape_value;
export const Model$Model$3 = (value) => value.shape_value;
export const Model$Model$speed_value = (value) => value.speed_value;
export const Model$Model$4 = (value) => value.speed_value;

export class SetCode extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetCode = ($0) => new SetCode($0);
export const Msg$isSetCode = (value) => value instanceof SetCode;
export const Msg$SetCode$0 = (value) => value[0];

export class ToggleCode extends $CustomType {}
export const Msg$ToggleCode$const = new ToggleCode();
export const Msg$ToggleCode = () => Msg$ToggleCode$const;
export const Msg$isToggleCode = (value) => value instanceof ToggleCode;

export class SetShape extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetShape = ($0) => new SetShape($0);
export const Msg$isSetShape = (value) => value instanceof SetShape;
export const Msg$SetShape$0 = (value) => value[0];

export class SetSpeed extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetSpeed = ($0) => new SetSpeed($0);
export const Msg$isSetSpeed = (value) => value instanceof SetSpeed;
export const Msg$SetSpeed$0 = (value) => value[0];

export class SetDrawing extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetDrawing = ($0) => new SetDrawing($0);
export const Msg$isSetDrawing = (value) => value instanceof SetDrawing;
export const Msg$SetDrawing$0 = (value) => value[0];

const default_code = "fn draw(shape_slider: Int) -> List(Path) {\n  [Path(Line(Point(0, 0), Point(100, 100)), 0, 10, 2)]\n}\n";

/**
 * Your app's public address, once you've deployed it in Problem 13, such as
 * "https://your-username.github.io/animator/".
 */
export const public_url = "";

/**
 * Set to True if you would like your app's URL included in the course gallery.
 */
export const include_app_in_gallery = false;

/**
 * A link to your video from Problem 14, which anyone with the link can watch.
 */
export const video_url = "";

/**
 * Set to True if you would like your video included in the course gallery.
 */
export const include_video_in_gallery = false;

export function init(_) {
  return [
    new Model("", true, "", 10, 50),
    $effect.batch(
      listPrepend(
        $editor.mount(default_code, (var0) => { return new SetCode(var0); }),
        listPrepend(
          $effect.from(
            (dispatch) => { return dispatch(new SetCode(default_code)); },
          ),
          $List$Empty$const,
        ),
      ),
    ),
  ];
}

function run_source(shape_slider, source) {
  let $ = $parser.parse_program(source, $builtins.global_frame());
  if ($ instanceof Ok) {
    let program = $[0];
    let _pipe = $drawing.try_draw(shape_slider, program);
    return $result.map_error(_pipe, $errors.error_message);
  } else {
    return $;
  }
}

export function update(model, msg) {
  if (msg instanceof SetCode) {
    let text = msg[0];
    let $ = run_source(model.shape_value, text);
    if ($ instanceof Ok) {
      let paths = $[0];
      return [
        new Model(
          text,
          model.code_open,
          $string.inspect(paths),
          model.shape_value,
          model.speed_value,
        ),
        $effect.from(
          (_) => {
            let render_paths = $list.map(
              paths,
              (path) => { return $render.render_path(path, "black"); },
            );
            $render.set_drawing(render_paths);
            return $render.reset_clock();
          },
        ),
      ];
    } else {
      let msg$1 = $[0];
      return [
        new Model(
          text,
          model.code_open,
          msg$1,
          model.shape_value,
          model.speed_value,
        ),
        $effect.none(),
      ];
    }
  } else if (msg instanceof ToggleCode) {
    return [
      new Model(
        model.source,
        !model.code_open,
        model.output,
        model.shape_value,
        model.speed_value,
      ),
      $effect.none(),
    ];
  } else if (msg instanceof SetShape) {
    let text = msg[0];
    let value = $result.unwrap($int.parse(text), model.shape_value);
    let $ = run_source(value, model.source);
    if ($ instanceof Ok) {
      let paths = $[0];
      return [
        new Model(
          model.source,
          model.code_open,
          $string.inspect(paths),
          value,
          model.speed_value,
        ),
        $effect.from(
          (_) => {
            let render_paths = $list.map(
              paths,
              (path) => { return $render.render_path(path, "black"); },
            );
            $render.set_drawing(render_paths);
            return $render.reset_clock();
          },
        ),
      ];
    } else {
      let msg$1 = $[0];
      return [
        new Model(
          model.source,
          model.code_open,
          msg$1,
          value,
          model.speed_value,
        ),
        $effect.none(),
      ];
    }
  } else if (msg instanceof SetSpeed) {
    let text = msg[0];
    let value = $result.unwrap($int.parse(text), model.speed_value);
    let rate = $int.to_float(value) / 50.0;
    return [
      new Model(
        model.source,
        model.code_open,
        model.output,
        model.shape_value,
        value,
      ),
      $effect.from((_) => { return $render.set_speed(rate); }),
    ];
  } else {
    let name = msg[0];
    if (name === "default") {
      let $ = update(model, new SetCode(default_code));
      let new_model = $[0];
      let draw_effect = $[1];
      return [
        new_model,
        $effect.batch(
          listPrepend(
            draw_effect,
            listPrepend(
              $editor.mount(
                default_code,
                (var0) => { return new SetCode(var0); },
              ),
              $List$Empty$const,
            ),
          ),
        ),
      ];
    } else {
      let $ = $list.key_find($examples.all, name);
      if ($ instanceof Ok) {
        let source = $[0];
        let $1 = update(model, new SetCode(source));
        let new_model = $1[0];
        let draw_effect = $1[1];
        return [
          new_model,
          $effect.batch(
            listPrepend(
              draw_effect,
              listPrepend(
                $editor.mount(source, (var0) => { return new SetCode(var0); }),
                $List$Empty$const,
              ),
            ),
          ),
        ];
      } else {
        return [model, $effect.none()];
      }
    }
  }
}

function view_reveal_code(model) {
  let $ = model.code_open;
  if ($) {
    return $element.none();
  } else {
    return $html.button(
      listPrepend(
        $attr.class$("icon-btn reveal-code"),
        listPrepend(
          $attr.attribute("title", "Show code"),
          listPrepend($event.on_click(Msg$ToggleCode$const), $List$Empty$const),
        ),
      ),
      listPrepend($html.text("⟩"), $List$Empty$const),
    );
  }
}

function view_anim(model) {
  return $html.div(
    listPrepend($attr.class$("canvas-area"), $List$Empty$const),
    listPrepend(
      view_reveal_code(model),
      listPrepend(
        $html.div(
          $List$Empty$const,
          listPrepend(
            $html.text("Drawing"),
            listPrepend(
              $html.select(
                listPrepend(
                  $attr.attribute("data-test-id", "drawing-select"),
                  listPrepend(
                    $event.on_input((var0) => { return new SetDrawing(var0); }),
                    $List$Empty$const,
                  ),
                ),
                listPrepend(
                  $html.option(
                    listPrepend($attr.value("default"), $List$Empty$const),
                    "Default drawing",
                  ),
                  listPrepend(
                    $html.option(
                      listPrepend($attr.value("fan"), $List$Empty$const),
                      "Fan",
                    ),
                    listPrepend(
                      $html.option(
                        listPrepend(
                          $attr.value("square_spiral"),
                          $List$Empty$const,
                        ),
                        "Square Spiral",
                      ),
                      listPrepend(
                        $html.option(
                          listPrepend(
                            $attr.value("string_art"),
                            $List$Empty$const,
                          ),
                          "String Art",
                        ),
                        listPrepend(
                          $html.option(
                            listPrepend($attr.value("tree"), $List$Empty$const),
                            "Tree",
                          ),
                          $List$Empty$const,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              $List$Empty$const,
            ),
          ),
        ),
        listPrepend(
          $html.div(
            $List$Empty$const,
            listPrepend(
              $html.text("Shape"),
              listPrepend(
                $html.input(
                  listPrepend(
                    $attr.attribute("data-test-id", "shape-slider"),
                    listPrepend(
                      $attr.attribute("type", "range"),
                      listPrepend(
                        $attr.attribute("min", "0"),
                        listPrepend(
                          $attr.attribute("max", "100"),
                          listPrepend(
                            $attr.value($int.to_string(model.shape_value)),
                            listPrepend(
                              $event.on_input(
                                (var0) => { return new SetShape(var0); },
                              ),
                              $List$Empty$const,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                $List$Empty$const,
              ),
            ),
          ),
          listPrepend(
            $html.div(
              $List$Empty$const,
              listPrepend(
                $html.text("Speed"),
                listPrepend(
                  $html.input(
                    listPrepend(
                      $attr.attribute("data-test-id", "speed-slider"),
                      listPrepend(
                        $attr.attribute("type", "range"),
                        listPrepend(
                          $attr.attribute("min", "1"),
                          listPrepend(
                            $attr.attribute("max", "100"),
                            listPrepend(
                              $attr.value($int.to_string(model.speed_value)),
                              listPrepend(
                                $event.on_input(
                                  (var0) => { return new SetSpeed(var0); },
                                ),
                                $List$Empty$const,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  $List$Empty$const,
                ),
              ),
            ),
            listPrepend(
              $html.canvas(
                listPrepend($attr.id("animation-canvas"), $List$Empty$const),
              ),
              listPrepend(
                $html.pre(
                  listPrepend($attr.class$("output"), $List$Empty$const),
                  listPrepend($html.text(model.output), $List$Empty$const),
                ),
                $List$Empty$const,
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

export function view(model) {
  let _block;
  let $ = model.code_open;
  if ($) {
    _block = "app";
  } else {
    _block = "app code-hidden";
  }
  let app_class = _block;
  return $html.div(
    listPrepend($attr.class$(app_class), $List$Empty$const),
    listPrepend(
      $html.div(
        listPrepend($attr.class$("code-col"), $List$Empty$const),
        listPrepend($editor.view_panel(Msg$ToggleCode$const), $List$Empty$const),
      ),
      listPrepend(view_anim(model), $List$Empty$const),
    ),
  );
}

export function main() {
  let app = $lustre.application(init, update, view);
  let $ = $lustre.start(app, "#app", undefined);
  if (!($ instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "app",
      299,
      "main",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 8531,
        end: 8580,
        pattern_start: 8542,
        pattern_end: 8547
      }
    )
  }
  return undefined;
}
