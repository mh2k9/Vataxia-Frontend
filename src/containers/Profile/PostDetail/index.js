import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {getPost} from '../../../actions/posts/post/get';
import PostListItem from '../../../components/PostListItem';
import {getUsersFullName} from '../../../utils/user';
import PostReplyForm from '../../../forms/PostReplyForm';
import './PostDetail.scss'


class PostDetail extends Component {

    componentDidMount() {
        const {dispatch, params: {postId}} = this.props;
        dispatch(getPost(postId));
    }

    renderPostReplyForm() {
        const {activeUser, params: {postId}} = this.props;
        if(!activeUser) return null;
        return (
            <div className="card reply-form">
                <div className="card-block">
                    <PostReplyForm postId={Number(postId)}/>
                </div>
            </div>
        );
    }

    renderPostReplyList(postReplyList) {
        const {users} = this.props;
        return postReplyList
            .map(postReply =>
                <div className="media reply" key={postReply.id}>
                    <a href="">
                        <img className="d-flex" src="http://i.imgur.com/uuykYlB.png"/>
                    </a>
                    <div className="media-body">
                        <Link className="user"
                              to={`/profile/${postReply.user}/posts`}>{getUsersFullName(users, postReply.user)}</Link>
                        <span className="date"> · {postReply.modified_date}</span>
                        <div className="content">{postReply.body}</div>
                    </div>
                </div>
            );
    }

    renderReplySection() {
        const {post, postReplies} = this.props;
        const postReplyList = Object.values(postReplies)
            .filter(postReply => postReply.post === post.id);
        if (postReplyList.length === 0) return null;
        return (
            <div className="card reply-section">
                <div className="card-block">
                    {this.renderPostReplyList(postReplyList)}
                </div>
            </div>
        );
    }

    renderPostOverview() {
        const {post} = this.props;
        return (
            <div className="card post-overview">
                <div className="card-block">
                    <PostListItem
                        key={post.id}
                        post={post}
                    />
                </div>
            </div>
        );
    }

    render() {
        const {post} = this.props;
        if (!post) return null;
        return (
            <div className="PostDetail">
                {this.renderPostOverview()}
                {this.renderPostReplyForm()}
                {this.renderReplySection()}
            </div>
        );
    }

}

export default connect((state, props) => ({
    activeUser: state.activeUser,
    post: state.posts.data[props.params.postId],
    postReplies: state.postReplies.data,
    users: state.users.data,
}))(PostDetail);
