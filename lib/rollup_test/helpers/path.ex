defmodule RollupTest.Helpers.Path do
  def priv(rest) do
    Path.join(:code.priv_dir(:rollup_test), rest)
  end
end
