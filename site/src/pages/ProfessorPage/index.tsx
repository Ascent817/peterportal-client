import React, { FC, useState, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import LoadingPage from '../LoadingPage';
import Twemoji from 'react-twemoji';
import { Divider } from 'semantic-ui-react';
import axios from 'axios';
import ProfSideInfo from '../../component/ProfSideInfo/ProfSideInfo';
import Schedule from '../../component/Schedule/Schedule';
import Review from '../../component/Review/Review';
import GradeDist from '../../component/GradeDist/GradeDist';
import {
    Grid,
} from 'semantic-ui-react'

import { ProfessorData, CourseData, ReviewData } from '../../types/types';

const ProfessorPage: FC<RouteComponentProps<{ id: string }>> = (props) => {
    const [profData, setProfData] = useState<ProfessorData>(null!);
    const [profWebsoc, setProfWebsoc] = useState('');
    const fetchDataFromApi = async () => {
        const apiResponse = await axios.get<ProfessorData>('/professors/api/' + props.match.params.id);
        setProfWebsoc(apiResponse.data.shortened_name);
        setProfData(apiResponse.data);
    }

    useEffect(() => {
        fetchDataFromApi();
    }, []);

    if (!profData) {
        return <LoadingPage />;
    }
    else if (profData.hasOwnProperty('error')) {
        console.log(profData)
        return <div>
            Professor Does Not Exist!
        </div>
    } else {
        return (
            <Twemoji options={{ className: 'twemoji' }}>
                <div style={{ display: 'flex' }}>
                    <section style={{ position: 'sticky', top: '4rem', height: 'min-content', width: '340px', border: '1px solid #EEEEEE', borderRadius: '10px' }}>
                        <ProfSideInfo {...profData} />
                    </section>
                    <article style={{ marginLeft: '4rem', width: '900px' }}>
                        <Grid.Row>
                            <h2>🗓️ Schedule of Classes</h2>
                            <Divider />
                            <Schedule professorID={profWebsoc} />
                        </Grid.Row>

                        <Grid.Row>
                            <h2 id='grade-dist-label'>📊 Grade Distribution</h2>
                            <Divider />
                            <GradeDist professor={profData} />
                        </Grid.Row>                      
                        <Grid.Row>
                            <h2 id='grade-dist-label'>💬 Reviews</h2>
                            <Divider />
                            <Review professor={profData} />
                        </Grid.Row>
                    </article>
                </div>
            </Twemoji>
        )
    }
}

export default ProfessorPage