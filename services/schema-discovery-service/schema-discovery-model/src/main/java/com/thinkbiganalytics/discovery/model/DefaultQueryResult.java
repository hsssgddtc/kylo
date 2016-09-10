/*
 * Copyright (c) 2016. Teradata Inc.
 */

package com.thinkbiganalytics.discovery.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.thinkbiganalytics.discovery.schema.QueryResult;
import com.thinkbiganalytics.discovery.schema.QueryResultColumn;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by sr186054 on 3/31/16.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class DefaultQueryResult implements QueryResult {

    private String query;

    public DefaultQueryResult() {

    }

    public DefaultQueryResult(@JsonProperty("query") String query) {
        this.query = query;
    }

    private List<? extends QueryResultColumn> columns;

    private Map<String, QueryResultColumn> columnFieldMap;

    private Map<String, QueryResultColumn> columnDisplayNameMap;


    private List<Map<String, Object>> rows;

    @Override
    public List<? extends QueryResultColumn> getColumns() {
        return columns;
    }

    @Override
    public boolean isEmpty() {
        return this.getRows().isEmpty();
    }

    @Override
    public void setColumns(List<? extends QueryResultColumn> columns) {
        this.columns = columns;
        this.columnFieldMap = new HashMap<>();
        this.columnDisplayNameMap = new HashMap<>();
        if (columns != null) {
            int index = 0;
            for (QueryResultColumn column : columns) {
                column.setIndex(index);
                columnFieldMap.put(column.getField(), column);
                columnDisplayNameMap.put(column.getDisplayName(), column);
                index++;
            }
        }
    }

    @Override
    public List<Map<String, Object>> getRows() {
        if (rows == null) {
            rows = new ArrayList<>();
        }
        return rows;
    }

    @Override
    public void addRow(Map<String, Object> data) {
        getRows().add(data);
    }

    @Override
    public String getQuery() {
        return query;
    }

    @Override
    public Map<String, ? extends QueryResultColumn> getColumnFieldMap() {
        return columnFieldMap;
    }

    @Override
    public Map<String, ? extends QueryResultColumn> getColumnDisplayNameMap() {
        return columnDisplayNameMap;
    }
}
