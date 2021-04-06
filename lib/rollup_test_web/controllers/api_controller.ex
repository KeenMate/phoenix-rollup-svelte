defmodule RollupTestWeb.ApiController do
  use RollupTestWeb, :controller

  alias RollupTest.Images

  @role "member"

  def like(conn, %{"id" => id}) do
    IO.puts("Liked #{id}")

    roles = get_session(conn, :roles)

    cond do
      is_list(roles) and Enum.any?(roles, fn r -> r == @role end) ->
        Images.like_image(String.to_integer(id))

        conn
        |> send_resp(200, "")

      true ->
        conn
        |> send_resp(403, "Forbidden")
    end
  end

  def unlike(conn, %{"id" => id}) do
    IO.puts("Unliked #{id}")

    roles = get_session(conn, :roles)

    cond do
      is_list(roles) and Enum.any?(roles, fn r -> r == @role end) ->
        Images.unlike_image(String.to_integer(id))

        conn
        |> send_resp(200, "")

      true ->
        conn
        |> send_resp(403, "Forbidden")
    end
  end
end
