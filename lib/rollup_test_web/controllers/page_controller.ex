defmodule RollupTestWeb.PageController do
  use RollupTestWeb, :controller

  alias RollupTest.Apps

  def index(conn, _params) do
    conn
    |> Apps.include(["numbers", "connect"])
    |> render("index.html")
  end
end
