import React, { useState, useEffect, useRef } from 'react';
import Map from './map';
import { M } from '../js/materialize';
import eventsData from '../testFiles/events.json';

const MapContainer = () => {
    const [events, setEvents] = useState(eventsData);
    const regionSelectRef = useRef(null);
    const citySelectRef = useRef(null);
    const categorySelectRef = useRef(null);
    const datepickerRef = useRef(null);

    useEffect(() => {
        M.FormSelect.init(regionSelectRef.current, {});
        M.FormSelect.init(citySelectRef.current, {});
        M.FormSelect.init(categorySelectRef.current, {});
        // M.Datepicker.init(datepickerRef.current, {});
    }, []);

    function findEvents() {
        const selectedRegion = regionSelectRef.current.value;
        const selectedCity = citySelectRef.current.value;
        const selectedCategory = categorySelectRef.current.value;

        const filtered = eventsData.filter(event => {
            const matchesRegion = selectedRegion === '' || event.region === selectedRegion;
            const matchesCity = selectedCity === '' || event.city === selectedCity;
            const matchesCategory = selectedCategory === '' || event.category === selectedCategory;
            return matchesRegion && matchesCity && matchesCategory;
        });
        setEvents(filtered);
    }

    function cancelFilters() {
        regionSelectRef.current.value = '';
        citySelectRef.current.value = '';
        categorySelectRef.current.value = '';

        M.FormSelect.init(regionSelectRef.current, {});
        M.FormSelect.init(citySelectRef.current, {});
        M.FormSelect.init(categorySelectRef.current, {});

        setEvents(eventsData);
    }

    return (
        <section className='section'>
            <div className='row'>
                <form className='col s12'>
                    <div className="input-field outlined col s12 m6">
                        <select ref={regionSelectRef} id="form-select-region">
                            <option value="" disabled selected>Выберите область</option>
                            {eventsData.map(event => (
                                <option key={event.region} value={event.region}>{event.region}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-field outlined col s12 m6">
                        <select ref={citySelectRef} id="form-select-city">
                            <option value="" disabled selected>Выберите город</option>
                            {eventsData.map(event => (
                                <option key={event.city} value={event.city}>{event.city}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-field outlined col s12 m6">
                        <select ref={categorySelectRef} id="form-select-category">
                            <option value="" disabled selected>Выберите категорию</option>
                            {eventsData.map(event => (
                                <option key={event.category} value={event.category}>{event.category}</option>
                            ))}
                        </select>
                    </div>
                    {/* <div className="input-field col s12">
                    <input ref={datepickerRef} id="birthdate" type="text" className="datepicker" placeholder="Выберите дату" />
                    <label htmlFor="birthdate">Дата</label>
                    </div> */}
                    <div className='row'>
                        <a className="btn-floating btn-small waves-effect waves-light" onClick={findEvents}>
                            <i className="material-icons">search</i>
                        </a>
                        <a className="btn-floating btn-small waves-effect waves-light" onClick={cancelFilters}>
                            <i className="material-icons">cancel</i>
                        </a>
                    </div>
                </form>
            </div>
            <Map markers={events}/>
        </section>
    );
};

export default MapContainer;
