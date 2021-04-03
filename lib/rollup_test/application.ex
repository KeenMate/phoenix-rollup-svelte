defmodule RollupTest.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      # RollupTest.Repo,
      # Start the Telemetry supervisor
      RollupTestWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: RollupTest.PubSub},
      # Start the Endpoint (http/https)
      RollupTestWeb.Endpoint,
      RollupTest.Images
      # Start a worker by calling: RollupTest.Worker.start_link(arg)
      # {RollupTest.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: RollupTest.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    RollupTestWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
