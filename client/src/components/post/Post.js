import React, { Fragment, useEffect } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import Spinner from "../layout/Spinner"
import { getPost } from "../../actions/post"
import PostItem from "../posts/PostItem"
import CommentForm from "./CommentForm"
import CommentItem from "./CommentItem"
const Post = ({ getPost, post: { post, loading }, match }) => {
  useEffect(() => {
    getPost(match.params.id)
  }, [getPost])

  // return JSON.stringify(post)
  return (
    <Fragment>
      {loading || post === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <PostItem post={post} showActions={false} />
          <CommentForm postId={post._id} />
          <div className="comments">
            {post.comments.map(comment => (
              <CommentItem
                key={comment._id}
                comment={comment}
                postId={post._id}
              />
            ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

Post.propTypes = {
  getPost: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
  post: state.post
})

const mapDispatchToProps = {
  getPost
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Post)
