Rails.application.routes.draw do
  prefix = "app"
  if ENV["PATH_PREFIX"].present? && ENV["APP_NAME"].present?
    prefix = File.join(ENV["PATH_PREFIX"], ENV["APP_NAME"]).gsub(/^\/+|\/+$/, "")
  end

  # Should be forbidden in turnpike
  get '/others', :to => 'others#index'

  scope :as => :app, :path => prefix do
    root :to => 'queries#index'
    post '/', :to => 'queries#get_data'
    post '/load_structure', :to => 'queries#load_structure'
    get '/others', :to => 'others#index'
  end
end
