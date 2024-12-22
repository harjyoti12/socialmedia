import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../clinet';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchPins = async () => {
      setLoading(true);

      try {
        let query;
        if (categoryId) {
          query = searchQuery(categoryId);
        } else {
          query = feedQuery;
        }

        const data = await client.fetch(query);
        setPins(data);
      } catch (error) {
        console.error("Error fetching pins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPins();
  }, [categoryId]);

  // console.log(pins);

  const ideaName = categoryId || 'new';

  if (loading) {
    return <Spinner message={`We are adding ${ideaName} ideas to your feed!`} />;
  }

  return (
    <div>
      {pins.length > 0 ? (
        <MasonryLayout pins={pins} />
      ) : (
        <p>No pins available</p>
      )}
    </div>
  );
};

export default Feed;
