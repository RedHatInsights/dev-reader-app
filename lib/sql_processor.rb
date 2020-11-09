class SqlProcessor
  def initialize(query)
    @query = query
  end

  def run
    ActiveRecord::Base.connection.execute(@query)
  end
end
