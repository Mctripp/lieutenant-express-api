#!/bin/bash

API="http://localhost:4741"
URL_PATH="/exiles"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "exile": {
      "target": "'"${TARGET}"'",
      "source": "'"${SOURCE}"'",
      "game": "'"${GAME}"'",
      "turn": "'"${TURN}"'",
      "action": "'"${ACTION}"'"
    }
  }'

echo
