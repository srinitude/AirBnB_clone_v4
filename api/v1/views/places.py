#!/usr/bin/python3
"""places.py"""

from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from models import storage
from models.city import City
from models.place import Place
from models.user import User


@app_views.route('/cities/<city_id>/places', methods=['GET'])
def get_places(city_id):
    """get place information for all places in a specified city"""
    city = storage.get("City", city_id)
    if city is None:
        abort(404)
    places = []
    for place in city.places:
        places.append(place.to_dict())
    return jsonify(places)


@app_views.route('/cities/<city_id>/places', methods=['POST'])
def post_place(city_id):
    """create a new place"""
    city = storage.get("City", city_id)
    if city is None:
        abort(404)
    if not request.get_json():
        return make_response(jsonify({'error': 'Not a JSON'}), 400)
    kwargs = request.get_json()
    if 'user_id' not in kwargs:
        return make_response(jsonify({'error': 'Missing user_id'}), 400)
    user = storage.get("User", kwargs['user_id'])
    if user is None:
        abort(404)
    if 'name' not in kwargs:
        return make_response(jsonify({'error': 'Missing name'}), 400)
    kwargs['city_id'] = city_id
    place = Place(**kwargs)
    place.save()
    return make_response(jsonify(place.to_dict()), 201)


@app_views.route('/places/<place_id>', methods=['GET'])
def get_place(place_id):
    """get place information for specified place"""
    place = storage.get("Place", place_id)
    if place is None:
        abort(404)
    return jsonify(place.to_dict())


@app_views.route('/places/<place_id>', methods=['DELETE'])
def delete_place(place_id):
    """deletes a place based on its place_id"""
    place = storage.get("Place", place_id)
    if place is None:
        abort(404)
    place.delete()
    storage.save()
    return (jsonify({}))


@app_views.route('/places/<place_id>', methods=['PUT'])
def put_place(place_id):
    """update a place"""
    place = storage.get("Place", place_id)
    if place is None:
        abort(404)
    if not request.get_json():
        return make_response(jsonify({'error': 'Not a JSON'}), 400)
    for attr, val in request.get_json().items():
        if attr not in ['id', 'user_id', 'city_id', 'created_at',
                        'updated_at']:
            setattr(place, attr, val)
    place.save()
    return jsonify(place.to_dict())


@app_views.route('/places_search', methods=['POST'])
def places_search():
    """Search for Places having specified amenities and from listed
    cities and/or states"""
    body = request.get_json(silent=True)
    if body is None:
        return make_response(jsonify({'error': 'Not a JSON'}), 400)
    states = body.get('states', [])
    cities = set(body.get('cities', []))
    for state in states:
        st = storage.get('State', state)
        for city in st.cities:
            cities.add(city.id)
    amenities = body.get('amenities', [])
    all_places = storage.all('Place').values()
    if not cities:
        results = set(all_places)
    else:
        results = set()
        for place in all_places:
            for city in cities:
                if city == place.city_id:
                    results.add(place)
                    break
    if not amenities:
        filtered = list(results)
    else:
        filtered = []
        for place in results:
            pas = map(lambda pa: pa.id, place.amenities)
            ainp = all(a in pas for a in amenities)
            if ainp:
                filtered.append(place)
    filtered = list(map(lambda p: p.to_dict(), filtered))
    return jsonify(filtered)
