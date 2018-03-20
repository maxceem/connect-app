import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { CONNECT_MESSAGE_API_URL, DOMAIN } from '../config/constants'

const timeout = 1.5 * 60 * 1000
const apiBaseUrl = `https://api.${DOMAIN}/v4` || CONNECT_MESSAGE_API_URL

export function getTopics(criteria) {
  const params = {}
  // filters
  const filter = _.omit(criteria, ['sort'])
  if (!_.isEmpty(filter)) {
    // convert filter object to string
    const filterStr = _.map(filter, (v, k) => `${k}=${v}`)
    params.filter = filterStr.join('&')
  }

  return axios.get(`${apiBaseUrl}/topics/`, { params })
    .then( resp => {
      return {
        totalCount: _.get(resp.data, 'result.metadata.totalCount', 0),
        topics: _.get(resp.data, 'result.content', [])
      }
    })
}

export function getTopic(topicId) {
  return axios.get(`${apiBaseUrl}/topics/${topicId}`)
    .then( resp => {
      return {
        totalCount: _.get(resp.data, 'result.metadata.totalCount', 0),
        topic: _.get(resp.data, 'result.content', {}),
        topicId
      }
    })
}

export function getTopicPosts(topicId, postIds) {
  const params = { postIds : postIds.join(',') }
  return axios.get(`${apiBaseUrl}/topics/${topicId}/posts`, { params })
    .then( resp => {
      return {
        totalCount: _.get(resp.data, 'result.metadata.totalCount', 0),
        posts: _.get(resp.data, 'result.content', []),
        topicId
      }
    })
}

export function createTopic(topicProps) {
  return axios.post(`${apiBaseUrl}/topics/`, topicProps, { timeout })
    .then( resp => {
      return _.get(resp.data, 'result.content', {})
    })
}

export function saveTopic(topicId, topicProps) {
  return axios.post(`${apiBaseUrl}/topics/${topicId}/edit`, topicProps, { timeout })
    .then( resp => {
      return _.get(resp.data, 'result.content', {})
    })
}

export function deleteTopic(topicId) {
  return axios.delete(`${apiBaseUrl}/topics/${topicId}`, null, { timeout } )
    .then( resp => {
      return {
        result : _.get(resp.data, 'result.content', {})
      }
    })
}

export function addTopicPost(topicId, post) {
  return axios.post(`${apiBaseUrl}/topics/${topicId}/posts`, { post: post.content }, { timeout } )
    .then( resp => {
      return {
        topicId,
        comment : _.get(resp.data, 'result.content', {})
      }
    })
}

export function saveTopicPost(topicId, post) {
  return axios.post(`${apiBaseUrl}/topics/${topicId}/posts/${post.id}/edit`, { post: post.content }, { timeout } )
    .then( resp => {
      return {
        topicId,
        comment : _.get(resp.data, 'result.content', {})
      }
    })
}

export function getTopicPost(topicId, postId) {
  return axios.get(`${apiBaseUrl}/topics/${topicId}/posts/${postId}`, null, { timeout } )
    .then( resp => {
      return {
        topicId,
        comment : _.get(resp.data, 'result.content', {})
      }
    })
}

export function deleteTopicPost(topicId, postId) {
  return axios.delete(`${apiBaseUrl}/topics/${topicId}/posts/${postId}`, null, { timeout } )
    .then( resp => {
      return {
        result : _.get(resp.data, 'result.content', {})
      }
    })
}
