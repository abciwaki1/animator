//// Animator -- an application for program-generated drawings.

import builtins
import drawing
import examples
import editor
import errors
import gleam/int
import gleam/list
import gleam/result
import gleam/string
import lustre
import lustre/attribute as attr
import lustre/effect.{type Effect}
import lustre/element.{type Element}
import lustre/element/html
import lustre/event
import parser
import render
import shape.{type Path}


/// Your app's public address, once you've deployed it in Problem 13, such as
/// "https://your-username.github.io/animator/".
pub const public_url = ""

/// Set to True if you would like your app's URL included in the course gallery.
pub const include_app_in_gallery = False

/// A link to your video from Problem 14, which anyone with the link can watch.
pub const video_url = ""

/// Set to True if you would like your video included in the course gallery.
pub const include_video_in_gallery = False

const default_code = "fn draw(shape_slider: Int) -> List(Path) {\n  [Path(Line(Point(0, 0), Point(100, 100)), 0, 10, 2)]\n}\n"

// ── Model ──────────────────────────────────────────────────────────────────────

pub type Model {
  Model(
    // The code in the editor.
    source: String,
    // Whether the code editor is shown.
    code_open: Bool,
    output: String,
    shape_value: Int,
    speed_value: Int,
  )
}

pub type Msg {
  SetCode(String)

  // Layout controls
  ToggleCode
  SetShape(String)
  SetSpeed(String)
  SetDrawing(String)
}

// ── Init ───────────────────────────────────────────────────────────────────────

pub fn init(_flags: Nil) -> #(Model, Effect(Msg)) {
  #(
    Model(
      source:"",
      code_open:True,
      output:"",
      shape_value: 10,
      speed_value: 50,
    ),
    // Effects that happen automatically at the start go here.
    effect.batch([
      editor.mount(default_code, SetCode),
      effect.from(fn(dispatch) { dispatch(SetCode(default_code)) }),
    ]),
  )
}

// Parse and evaluate a draw function at the given shape-slider value, returning
// the rendered paths on success, or a human-readable message on failure.
fn run_source(shape_slider: Int, source: String) -> Result(List(Path), String) {
  case parser.parse_program(source, builtins.global_frame()) {
    Error(msg) -> Error(msg)
    Ok(program) ->
      drawing.try_draw(shape_slider, program)
      // Convert Error(EvalError) to Error(String) with a useful error message.
      |> result.map_error(errors.error_message)
  }
}

// ── Update ─────────────────────────────────────────────────────────────────────

pub fn update(model: Model, msg: Msg) -> #(Model, Effect(Msg)) {
  case msg {

    SetDrawing(name) -> {
      case name {
        "default" -> {
  let #(new_model, draw_effect) = update(model, SetCode(default_code))
  #(
    new_model,
    effect.batch([draw_effect, editor.mount(default_code, SetCode)]),
  )
}

_ ->
  case list.key_find(examples.all, name) {
    Ok(source) -> {
      let #(new_model, draw_effect) = update(model, SetCode(source))
      #(
        new_model,
        effect.batch([draw_effect, editor.mount(source, SetCode)]),
      )
    }

            Error(_) ->
              #(model, effect.none())
          }
      }
    }


    SetShape(text) -> {
      let value = result.unwrap(int.parse(text), model.shape_value)

      case run_source(value, model.source) {
        Ok(paths) ->
         #(
         Model(..model, shape_value: value, output: string.inspect(paths)),
         effect.from(fn(_dispatch) {
         let render_paths = list.map(paths, fn(path) {
           render.render_path(path, "black")
            })
           render.set_drawing(render_paths)
           render.reset_clock()
          }),
          )

        Error(msg) ->
         #(
          Model(..model, shape_value: value, output: msg),
          effect.none(),
          )
      }
    }

    SetSpeed(text) -> {
      let value = result.unwrap(int.parse(text), model.speed_value)
      let rate = int.to_float(value) /. 50.0

      #(
        Model(..model, speed_value: value),
        effect.from(fn(_dispatch) {
          render.set_speed(rate)
       }),
      )
    }





    ToggleCode -> #(Model(..model, code_open: !model.code_open), effect.none())

    // After each keystroke in the editor, evaluate user code and report errors.
    SetCode(text) ->
      case run_source(model.shape_value, text) {
        // Parsed and evaluated: show the result.
        Ok(paths) -> #(
          Model(..model, output: string.inspect(paths), source: text),
          effect.from(fn(_dispatch) {
            let render_paths = list.map(paths, fn(path) {
              render.render_path(path, "black")
            })
            render.set_drawing(render_paths)
            render.reset_clock()
          }),
       )



        // Broken (parse or evaluation): show the error.
        Error(msg) -> #(
          Model(..model, output: msg, source: text),
          effect.none(),
        )
      }
  }
}

// ── View ──────────────────────────────────────────────────────────────────
//
// Two side-by-side panes: the code editor on the left and its rendered output on
// the right. The code column can be hidden to expand the right pane.

pub fn view(model: Model) -> Element(Msg) {
  let app_class = case model.code_open {
    True -> "app"
    False -> "app code-hidden"
  }
  // The code column still exists even when hidden (CSS collapses it) so the
  // mounted CodeMirror editor keeps its state across show/hide.
  html.div([attr.class(app_class)], [
    html.div([attr.class("code-col")], [
      editor.view_panel(ToggleCode),
    ]),
    view_anim(model),
  ])
}

fn view_anim(model: Model) -> Element(Msg) {
  html.div([attr.class("canvas-area")], [
    view_reveal_code(model),

  html.div([], [
     html.text("Drawing"),
     html.select(
        [
           attr.attribute("data-test-id", "drawing-select"),
           event.on_input(SetDrawing),
        ],
        [
         html.option([attr.value("default")], "Default drawing"),
         html.option([attr.value("fan")], "Fan"),
         html.option([attr.value("square_spiral")], "Square Spiral"),
         html.option([attr.value("string_art")], "String Art"),
         html.option([attr.value("tree")], "Tree"),
    ],
  ),
]),


    html.div([], [
      html.text("Shape"),
      html.input([
        attr.attribute("data-test-id", "shape-slider"),
        attr.attribute("type", "range"),
        attr.attribute("min", "0"),
        attr.attribute("max", "100"),
        attr.value(int.to_string(model.shape_value)),
        event.on_input(SetShape),
      ]),
    ]),

    html.div([], [
      html.text("Speed"),
      html.input([
        attr.attribute("data-test-id", "speed-slider"),
        attr.attribute("type", "range"),
        attr.attribute("min", "1"),
        attr.attribute("max", "100"),
        attr.value(int.to_string(model.speed_value)),
        event.on_input(SetSpeed),
      ]),
    ]),



    html.canvas(
  [attr.id("animation-canvas")],
),



    html.pre(
      [attr.class("output")],
      [html.text(model.output)],


    ),

  ])
}

// The button that brings the code column back, overlaid on the top-left of the
// right pane. Nothing is rendered while the column is already showing (its own
// header holds the button that hides it).
fn view_reveal_code(model: Model) -> Element(Msg) {
  case model.code_open {
    True -> element.none()
    False ->
      html.button(
        [
          attr.class("icon-btn reveal-code"),
          attr.attribute("title", "Show code"),
          event.on_click(ToggleCode),
        ],
        [html.text("⟩")],
      )
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────

pub fn main() -> Nil {
  let app = lustre.application(init, update, view)
  let assert Ok(_) = lustre.start(app, "#app", Nil)
  Nil
}
