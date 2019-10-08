import React, { Fragment, useEffect } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import Spinner from "../layout/Spinner"
import { getPost, addComment, deleteComment } from "../../actions/post"
import PostItem from "../posts/PostItem"
import CommentForm from "./CommentForm"
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
