class QueriesController < ApplicationController
  def index
  end

  def create
    @query = params[:query]

    @results = SqlProcessor.new(@query).run

    @rows_cnt = @results.count
    @col_names = []

    if @rows_cnt > 0
      @col_names = @results[0].keys
    end

    render :create
  end
end
