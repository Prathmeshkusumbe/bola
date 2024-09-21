import React, { useState } from 'react'
import { isNullUndefinedOrEmpty } from '@/helper/generalHelper'
import React from 'react'

function Gent({ userSearchRes }) {
  console.log(userSearchRes, 'userSearchRes')
  return (
    <div>
      {userSearchRes.length > 0 ? (
        <ul>
          {userSearchRes.map((user) => (
            <li key={user.id}>{user.username}</li> // Assuming user object has a unique `id` field
          ))}
        </ul>
      ) : (
        <div>No users found.</div>
      )}
    </div>
  )
}

export default Gent