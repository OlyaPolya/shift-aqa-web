export const MOCK_ONE_PRODUCT_RESPONSE = {
    pagination: {page: 1, limit: 25, total: 100, totalPages: 4},
    products: [{
      "id": "prod-001",
      "name": "Молочный шоколад",
      "price": 630,
      "category": "chocolate",
      "image": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+CiAgICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzRhMmMyYSIvPgogICAgPHRleHQgeD0iMTAwIiB5PSI5MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZThkNWI3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+0JzQvtC70L7Rh9C90YvQuSDRiNC+0LrQvtC70LDQtDwvdGV4dD4KICAgIDx0ZXh0IHg9IjEwMCIgeT0iMTIwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfjaw8L3RleHQ+CiAgPC9zdmc+"
    }]
  }

export const MOCK_SERVER_ERROR_RESPONSE = {
  server: {error: 'Internal Server Error'},
}

export const MOCK_FEEDBACK_SUCCESS_RESPONSE = {
  success: true,
  message: 'Ваша обратная связь принята'
}

// пока не понимаю как лучше сформировать
