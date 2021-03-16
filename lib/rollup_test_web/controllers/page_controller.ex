defmodule RollupTestWeb.PageController do
  use RollupTestWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
