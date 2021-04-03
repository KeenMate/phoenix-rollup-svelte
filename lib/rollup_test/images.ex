defmodule RollupTest.Images do
  use Agent

  @images [{"/images/a.jpg", false}, {"/images/b.jpg", false}, {"/images/c.jpg", false}, {"/images/d.jpg", false}]

  def start_link(_) do
    Agent.start_link(fn -> @images end, name: __MODULE__)
  end

  def get_images() do
    Agent.get(__MODULE__, & &1)
  end

  def like_image(num) do
    Agent.update(__MODULE__, fn images -> List.update_at(images, num, fn {path, _} -> {path, true} end) end)
  end

  def unlike_image(num) do
    Agent.update(__MODULE__, fn images -> List.update_at(images, num, fn {path, _} -> {path, false} end) end)
  end
end
