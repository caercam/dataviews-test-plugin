import { store as coreDataStore, useEntityRecords } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { DataViews } from "@wordpress/dataviews";
import { format } from "@wordpress/date";
import { useState } from '@wordpress/element';

const CategoriesList = ( { terms } ) => {
	return (
		<div>
			{ terms ? terms.map( ( term, index ) => term && (
				<span key={ index }>
					<a href={ `${ window.location.origin }/wp-admin/edit.php?post_type=post&category=${ term.slug }` }>{ term.name }</a>
					{ index < terms.length - 1 && `, ` }
				</span>
			) ) : null }
		</div>
	);
};

const App = () => {
	const [ perPage, setPerPage ] = useState( 4 );
	const [ page, setPage ] = useState( 1 );

    const queryArgs = { per_page: perPage, page };

    const { records, hasResolved } = useEntityRecords( 'postType', 'post', queryArgs );

    const { posts, categories, totalPages, totalItems } = useSelect(
        select => {
			const posts = select( coreDataStore ).getEntityRecords( 'postType', 'post', queryArgs );

			const totalPages = select( coreDataStore ).getEntityRecordsTotalPages( 'postType', 'post', queryArgs );
			const totalItems = select( coreDataStore ).getEntityRecordsTotalItems( 'postType', 'post', queryArgs );

			const categories = select( coreDataStore ).getEntityRecords( 'taxonomy', 'category', {
				per_page: 100,
				include: ( posts ? _.uniq( _.flatten( _.map( posts, post => post.categories ) ) ) : [] ).join( ',' ),
			} );
            return { posts, categories, totalItems, totalPages };
        }
    );

    const onChangeView = ( view ) => {
		console.log( view );
		if ( view.perPage !== perPage ) {
			setPerPage( view.perPage );
		}
		if ( view.page !== page ) {
			setPage( view.page );
		}
	};

    return (
        <DataViews
            actions={[]}
            data={ posts ?? [] }
            defaultLayouts={{
                table: {
                    layout: {
                        primaryField: 'title',
                        styles: {
                            title: {
                                maxWidth: 200
                            },
                            categories: {
                                maxWidth: 200
                            },
                            date: {
                                width: 150
                            }
                        }
                    }
                }
            }}
            fields={[
                {
                    id: 'title',
                    header: 'Title',
                    render: ( { item } ) => (
                        <a href={ `/wp-admin/post.php?post=${ item.id }&action=edit` }>{ item.title.rendered }</a>
                    )
                },
                {
                    id: 'categories',
                    header: 'Categories',
                    enableHiding: true,
                    render: ( { item } ) => categories && (
                        <CategoriesList
                            terms={
                                categories
                                    ? _.filter( item.categories.map( category => categories.find( term => term.id === category ) ) )
                                    : []
                            }
                        />
                    )
                },
                {
                    id: 'date',
                    header: 'Date',
                    getValue: ( { item } ) => format( 'j F Y', item.post_date )
                },
            ]}
            onChangeView={ onChangeView }
            paginationInfo={{
                totalItems: totalItems ?? null,
                totalPages: totalPages ?? null
            }}
            view={{
                fields: [
                    'title',
                    'categories',
                    'date',
                ],
                filters: [],
                layout: {},
                page: page,
                perPage: perPage,
                search: '',
                type: 'table'
            }}
        />
    );
};

export default App;