import { Button, Collapse, Divider, Icon, Text } from '@blueprintjs/core';
import * as React from 'react';
import { BookmarkProvider } from './BookmarkProvider';

type Props = {
    onConnectFromBookmark: (bookmark: BookmarkProvider.Bookmark) => void;
};

type State = {
    bookmarks: Array<BookmarkProvider.Bookmark>;
    expandList: boolean;
};

export default class BookmarkList extends React.Component<Props, State> {
    
    constructor(props: Props) {
        super(props);

        this.state = {
            bookmarks: this.getSortedBookmarks(),
            expandList: false
        };
    }

    private getSortedBookmarks(): Array<BookmarkProvider.Bookmark> {
        return BookmarkProvider
            .getBookmarks()
            .sort((a, b): number => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1;
                }
                if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return 1;
                }
                return 0;
            });
    }

    componentDidMount = () => {
        window.addEventListener('rabbit-bookmarks-storage-update', this.updateBookmarksList);
    }

    componentWillUnmount(): void {
        window.removeEventListener('rabbit-bookmarks-storage-update', this.updateBookmarksList);
    }

    updateBookmarksList = () => {
        this.setState({ bookmarks: this.getSortedBookmarks() });
    }

    deleteBookmarkAtIndex = (index: number): void => {
        BookmarkProvider.deleteBookmark(this.state.bookmarks[index]);
    }

    render() 
    {
        if (this.state.bookmarks.length === 0) {
            return null;
        }

        const list = this.state.bookmarks.map((bookmark, index) => {
            return <section key={ index } className={ 'bookmark_list_item' + (index % 2 === 0 ? ' even' : '') }>
                <div>
                    <Icon icon="caret-right" />
                </div>
                <div>
                    <Text><strong>{ bookmark.name }</strong></Text>
                    <Text><em>{ bookmark.address }, { bookmark.port }</em></Text>
                </div>
                <div className="bookmark_item_ctas">
                    <Button text="" 
                            small={ true } 
                            icon="trash" 
                            onClick={ () => { this.deleteBookmarkAtIndex(index) } } />
                    &nbsp;
                    <Button text="Connect" 
                            small={ true } 
                            onClick={ () => { this.props.onConnectFromBookmark(this.state.bookmarks[index]) } }/>
                </div>
            </section>
        })
        
        if (this.state.bookmarks.length < 3) {
            return <section>
                <br />
                <Divider className='bp3-dark' />

                <h4>Choose from bookmarks</h4>
                { list }
            </section>
        }

        return <section>
            <br />
            <Divider className='bp3-dark' />

            <h4 onClick={ () => { this.setState({ expandList: !this.state.expandList })} }
                style={ { cursor: 'pointer' } }>
                Choose from bookmarks <Icon icon={ !this.state.expandList ? "add" : "remove" } />
            </h4>
            
            <Collapse isOpen={ this.state.expandList }>
                { list }
            </Collapse>
        </section>;
    }
} 
