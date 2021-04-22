defmodule RollupTestWeb.PageView do
  use RollupTestWeb, :view

  def page_title("index.html", _), do: "Ondra's Boobies"

  def page_title("another_page.html", %{number: num}), do: "Order: #{num}"
end
