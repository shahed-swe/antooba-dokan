
import React from 'react'
import ReactDataTable from 'react-data-table-component'
import { SearchWithSuggestions } from '../search/Index'
import { Loader } from '../loading/Index';
import { NoContent } from '../204/NoContent';

export const DataTable = (props) => {
    return (
        <ReactDataTable
            columns={props.columns}
            data={props.data}
            progressPending={props.loading}
            progressComponent={<Loader/>}
            customStyles={props.customStyles}
            pagination
            noDataComponent={<NoContent message={props.noDataMessage || "No content available."}/>}
            paginationServer
            paginationTotalRows={props.totalRows}
            onChangeRowsPerPage={props.handlePerRowsChange}
            onChangePage={props.handlePageChange}
            subHeader={props.searchable}
            subHeaderComponent={
                <SearchWithSuggestions
                    placeholder={props.placeholder}
                    searchLoading={props.searchLoading}
                    search={query => props.search(query)}
                    suggestion={props.suggestion}
                    clear={() => props.clearSearch()}
                />}
        />
    );
};
