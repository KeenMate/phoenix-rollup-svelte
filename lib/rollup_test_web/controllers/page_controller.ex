defmodule RollupTestWeb.PageController do
  use RollupTestWeb, :controller

  import RollupTest.Components

  def index(conn, _params) do
    conn
    |> include(["numbers", "connect"])
    |> render("index.html")
  end
end
