defmodule RollupTestWeb.Apps do
  use RollupTestWeb.Apps.AppsMacro, path_in_static: "/apps/", application: :rollup_test

  def collect_scripts([]), do: []

  def collect_scripts(wanted) when is_list(wanted) do
    Enum.map(wanted, &app_script/1)
  end

  def collect_styles([]), do: []

  def collect_styles(wanted) when is_list(wanted) do
    Enum.map(wanted, &app_style/1)
  end

  def include(conn, apps) when is_list(apps) do
    conn
    |> Plug.Conn.assign(:additional_scripts, collect_scripts(apps))
    |> Plug.Conn.assign(:additional_styles, collect_styles(apps))
  end
end
