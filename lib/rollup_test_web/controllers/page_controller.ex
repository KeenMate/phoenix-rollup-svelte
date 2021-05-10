defmodule RollupTestWeb.PageController do
  use RollupTestWeb, :controller
  require Logger

  alias RollupTest.{Images}
  alias RollupTestWeb.Apps

  def index(conn, _params) do
    conn
    |> Apps.include(["numbers", "connect", "like", "subscription-form", "notifications"])
    |> put_session(:roles, ["member"])
    |> assign(:images, Images.get_images())
    |> assign(:token, get_csrf_token())
    |> render("index.html")
  end

  def another_page(conn, _params) do
    conn
    |> Apps.include(["connect", "numbers"])
    |> render("another_page.html")
  end

  def yet_another_page(conn, _params) do
    conn
    |> Apps.include(["connect", "numbers"])
    |> assign(:number, 12)
    |> render("another_page.html")
  end

  def subscribe(conn, %{"displayName" => display_name, "email" => email}) do
    Logger.info("Subscribing user #{display_name} (#{email})")

    conn
    |> put_flash(:info, "You have just subscribed to my collection with email #{email}")
    |> redirect(to: Routes.page_path(conn, :index))

  end


end
