defmodule RollupTest.ComponentsMacro do
  @manifest_path "/static/components/manifest.json"

  defmacro __using__(options) do
    path = Keyword.fetch!(options, :manifest_path)
    manifest = File.read!(Path.join(:code.priv_dir(:rollup_test), path)) |> Jason.decode!()
    manifest_escaped = Macro.escape(manifest)

    quote do
      @manifest unquote(manifest_escaped)
      @before_compile unquote(__MODULE__)
    end
  end

  defmacro __before_compile__(env) do
    manifest = Module.get_attribute(env.module, :manifest)

    Enum.map(manifest, fn {_, component} ->
      quote do
        def component_style(unquote(component["name"])) do
          unquote(component["stylePath"])
        end

        def component_script(unquote(component["name"])) do
          unquote(component["scriptPath"])
        end
      end
    end)
  end
end
