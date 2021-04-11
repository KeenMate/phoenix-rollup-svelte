FROM elixir:1.11

ARG MIX_ENV

ENV MIX_ENV=${MIX_ENV}
ENV SHELL=/bin/bash

WORKDIR /app
COPY ./_build/${MIX_ENV}/rel/rollup_test .

CMD ["./bin/rollup_test", "start"]
