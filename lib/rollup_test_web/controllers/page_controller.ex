defmodule RollupTestWeb.PageController do
  use RollupTestWeb, :controller

  alias RollupTest.{Apps, Images}

  def index(conn, _params) do
    conn
    |> Apps.include(["numbers", "connect", "like"])
    |> assign(:images, Images.get_images())
    |> render("index.html")
  end
end
