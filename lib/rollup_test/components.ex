defmodule RollupTest.Components do
  alias RollupTestWeb.Router.Helpers, as: Routes

  def components() do
    %{
      numbers: %{
        scripts: [
          Routes.static_path(RollupTestWeb.Endpoint, "/components/numbers/numbers.js")
        ],
        styles: [
          Routes.static_path(RollupTestWeb.Endpoint, "/components/numbers/numbers.css")
        ]
      },
      connect: %{
        scripts: [
          Routes.static_path(RollupTestWeb.Endpoint, "/components/connect/connect.js")
        ],
        styles: [
          Routes.static_path(RollupTestWeb.Endpoint, "/components/connect/connect.css")
        ]
      }
    }
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
      |> Enum.flat_map(fn c -> c.scripts end)
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
      |> Enum.flat_map(fn c -> c.styles end)
    end
  end
end
