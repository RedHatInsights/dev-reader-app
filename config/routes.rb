Rails.application.routes.draw do
  prefix = "app"
  if ENV["PATH_PREFIX"].present? && ENV["APP_NAME"].present?
    prefix = File.join(ENV["PATH_PREFIX"], ENV["APP_NAME"]).gsub(/^\/+|\/+$/, "")
  end

  scope :as => :app, :path => prefix do
    root :to => 'queries#index'
    post '/', :to => 'queries#create'
  end
end
