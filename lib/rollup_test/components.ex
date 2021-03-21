defmodule RollupTest.Components do
  import RollupTest.Helpers.Path

  @manifest_path "/static/components/manifest.json"

  def components() do
    File.read!(priv(@manifest_path))
    |> Jason.decode!()
  end

  def component_list() do
    components()
    |> Map.keys()
  end

  def collect_scripts([]), do: []

  def collect_scripts(wanted) when is_list(wanted) do
    components = Enum.map(wanted, &Map.fetch(components(), &1))

    # If some component not found
    if Enum.any?(components, fn c -> c == :error end) do
      {:error, :not_found}
    else
      components
      |> Enum.map(&elem(&1, 1))
      |> Enum.map(fn c -> c["scriptPath"] end)
    end
  end

  def collect_styles([]), do: []

  def collect_styles(wanted) when is_list(wanted) do
    components = Enum.map(wanted, &Map.fetch(components(), &1))

    # If some component not found
    if Enum.any?(components, fn c -> c == :error end) do
      {:error, :not_found}
    else
      components
      |> Enum.map(&elem(&1, 1))
      |> Enum.map(fn c -> c["stylePath"] end)
    end
  end

  def include(conn, components) when is_list(components) do
    conn
    |> Plug.Conn.assign(:additional_scripts, collect_scripts(components))
    |> Plug.Conn.assign(:additional_styles, collect_styles(components))
  end
end
