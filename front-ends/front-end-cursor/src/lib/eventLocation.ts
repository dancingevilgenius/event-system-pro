/** Shape of `event.location_json` used by demo seeds and the add-event form. */
export type EventLocationJson = {
  venue: string;
  street: string;
  city: string;
  state: string;
  country: string;
  map_url: string;
};

export const EMPTY_EVENT_LOCATION: EventLocationJson = {
  venue: '',
  street: '',
  city: '',
  state: '',
  country: '',
  map_url: '',
};

export function eventLocationToJson(location: EventLocationJson): EventLocationJson {
  return {
    venue: location.venue.trim(),
    street: location.street.trim(),
    city: location.city.trim(),
    state: location.state.trim(),
    country: location.country.trim(),
    map_url: location.map_url.trim(),
  };
}

/** Online and contact details for an event venue (add-event form). */
export type EventVenueContactJson = {
  website: string;
  phone: string;
  social_media_1: string;
  social_media_2: string;
  social_media_3: string;
};

export const EMPTY_EVENT_VENUE_CONTACT: EventVenueContactJson = {
  website: '',
  phone: '',
  social_media_1: '',
  social_media_2: '',
  social_media_3: '',
};

export function eventVenueContactToJson(contact: EventVenueContactJson): EventVenueContactJson {
  return {
    website: contact.website.trim(),
    phone: contact.phone.trim(),
    social_media_1: contact.social_media_1.trim(),
    social_media_2: contact.social_media_2.trim(),
    social_media_3: contact.social_media_3.trim(),
  };
}
