defmodule RollupTestWeb.AppsMacro do
  require Logger

  @moduledoc """

  **path_in_static is relative path to static directory!**
  """

  defmacro __using__(options) do
    application = Keyword.fetch!(options, :application)
    path = Keyword.fetch!(options, :path_in_static)

    manifest = RollupTestWeb.Helpers.AppsHelper.create_manifest(path,application)
    manifest_escaped = Macro.escape(manifest)

    quote do
      @manifest unquote(manifest_escaped)
      @before_compile unquote(__MODULE__)
    end
  end


  defmacro __before_compile__(env) do
    manifest = Module.get_attribute(env.module, :manifest)

    IO.inspect(manifest, label: "generated manifest")

    [Enum.map(manifest, fn %{ name: name,style_path: style,script_path: script}  ->
      Logger.debug("Generating code for app: #{name}")

      quote do
        def app_style(unquote(name)) do
          unquote(style)
        end

        def app_script(unquote(name)) do
          unquote(script)
        end
      end
    end),
    quote do
      def app_style(app_name) do
        # raise "Style for application: #{app_name} not available"
      end

      def app_script(app_name) do
        # raise "Script for application: #{app_name} not available"
      end
    end
  ]
  end
end
