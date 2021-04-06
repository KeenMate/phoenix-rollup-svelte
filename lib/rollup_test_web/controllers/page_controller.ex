defmodule RollupTestWeb.PageController do
  use RollupTestWeb, :controller

  alias RollupTest.{Apps, Images}

  def index(conn, _params) do
    conn
    |> Apps.include(["numbers", "connect", "like"])
    |> put_session(:roles, ["member"])
    |> assign(:images, Images.get_images())
    |> assign(:token, get_csrf_token())
    |> render("index.html")
  end
end
