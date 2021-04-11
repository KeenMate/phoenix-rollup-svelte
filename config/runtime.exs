import Config

if config_env() == :prod do
  config :logger,
    level: System.fetch_env!("LOG_LEVEL") |> String.downcase() |> String.to_existing_atom()

  # config :logger, Gelfx,
  #   host: System.fetch_env!("GRAYLOG_HOST"),
  #   port: String.to_integer(System.fetch_env!("GRAYLOG_PORT")),
  #   hostname: System.fetch_env!("APP_HOSTNAME"),
  #   format: "$time [$level] $message"

  # config :rollup_test, DhlLoginDemo.Repo,
  #   # ssl: true,
  #   url: System.fetch_env!("DATABASE_URL"),
  #   pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")

  config :rollup_test, RollupTestWeb.Endpoint,
    url: [scheme: "https", host: System.fetch_env!("HOST"), port: 443],
    http: [:inet6, port: String.to_integer(System.fetch_env!("PORT")), compress: true],
    secret_key_base: System.fetch_env!("SECRET_KEY_BASE")
end
