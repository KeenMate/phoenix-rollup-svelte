defmodule RollupTestWeb.ApiController do
  use RollupTestWeb, :controller

  alias RollupTest.Images

  def like(conn, %{"id" => id}) do
    IO.puts("Liked #{id}")

    Images.like_image(String.to_integer(id))

    conn
    |> send_resp(200, "")
  end

  def unlike(conn, %{"id" => id}) do
    IO.puts("Unliked #{id}")

    Images.unlike_image(String.to_integer(id))

    conn
    |> send_resp(200, "")
  end
end
