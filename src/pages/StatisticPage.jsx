import MenuComponent from "../components/MenuComponent";
import StatisticComponent from "../components/statisticPage/StatisticComponent";

import "./statisticPage.css"

export default function StatisticPage(){

    return(
        <div className="statistic-page">
                <MenuComponent path="statistic"/>
                <StatisticComponent />
        </div>
    )
}