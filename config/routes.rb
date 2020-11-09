Rails.application.routes.draw do
  resources :queries, :only => %i[index create]
end
