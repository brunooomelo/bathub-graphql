import path from 'path'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers } from '@graphql-tools/schema-merging'

const loadResolver = loadFilesSync(path.resolve(__dirname, '**', 'resolvers.js'))
const mergeResolver = mergeResolvers(loadResolver)

export default mergeResolver