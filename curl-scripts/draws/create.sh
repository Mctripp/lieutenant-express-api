#!/bin/bash

API="http://localhost:4741"
URL_PATH="/draws"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "draw": {
      "target": "'"${TARGET}"'",
      "source": "'"${SOURCE}"'",
      "drawn": "'"${DRAWN}"'",
      "game": "'"${GAME}"'",
      "turn": "'"${TURN}"'",
      "action": "'"${ACTION}"'"
    }
  }'

echo
