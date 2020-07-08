#!/bin/bash

API="http://localhost:4741"
URL_PATH="/discards"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "discard": {
      "target": "'"${TARGET}"'",
      "source": "'"${SOURCE}"'",
      "discarded": "'"${DRAWN}"'",
      "game": "'"${GAME}"'",
      "turn": "'"${TURN}"'",
      "action": "'"${ACTION}"'"
    }
  }'

echo
