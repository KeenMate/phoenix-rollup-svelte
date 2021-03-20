defmodule RollupTestWeb.PageController do
  use RollupTestWeb, :controller

  import RollupTest.Components

  def index(conn, _params) do
    conn
    |> assign(:additional_scripts, collect_scripts([:numbers, :connect]))
    |> assign(:additional_styles, collect_styles([:numbers, :connect]))
    |> render("index.html")
  end
end
