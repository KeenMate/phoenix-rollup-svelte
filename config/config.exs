# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :rollup_test,
  ecto_repos: [RollupTest.Repo]

# Configures the endpoint
config :rollup_test, RollupTestWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "Ggkffr8jhCJyOowA7SHAgZr+OHLP7eGiyrkfGeTmjhhssK/y/ijquWn0SqMm726s",
  render_errors: [view: RollupTestWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: RollupTest.PubSub,
  live_view: [signing_salt: "IWDokg88"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
