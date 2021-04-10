defmodule RollupTestWeb.PageController do
  use RollupTestWeb, :controller
  require Logger

  alias RollupTest.{Apps, Images}

  def index(conn, _params) do
    conn
    |> Apps.include(["numbers", "connect", "like", "subscription-form"])
    |> put_session(:roles, ["member"])
    |> assign(:images, Images.get_images())
    |> assign(:token, get_csrf_token())
    |> render("index.html")
  end

  def subscribe(conn, %{"displayName" => display_name, "email" => email}) do
    Logger.info("Subscribing user #{display_name} (#{email})")

    conn
    |> Apps.include(["numbers", "connect", "like", "subscription-form"])
    |> put_session(:roles, ["member"])
    |> put_flash(:info, "Subscribed to my collection")
    |> assign(:images, Images.get_images())
    |> assign(:token, get_csrf_token())
    |> render("index.html")

  end


end
