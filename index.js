const express = require('express');
const app = express();
const mongoose = require('mongoose');

const apiRoutes = require('./routes/api');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v1', apiRoutes);

require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_ADDRESS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

function insertPublications() {
    require('fs').readFile('uni.txt', (err, file) => {
        if (err) return;
        let data = [];
        String(file).split('\n').forEach(pub => {
            const d = pub.split(';');
            const releasedDate = d[8].split('-');
            data.push({
                title: d[0],
                university_id: d[1],
                association_id: d[2],
                number: d[3],
                image_url: d[4],
                description: d[5],
                full_description: d[6],
                download_url: d[7],
                released_at: new Date(releasedDate[0], releasedDate[1] - 1),
                creators: {
                    ceo: d[9],
                    association_name: d[2],
                    university_name: d[1],
                    cover_designer: d[10],
                    page_designer: d[11]
                }
            });
        });

        require('./models/publications/Publications').insertMany(data, {}, (err, result) => {
            if (err) console.log(err);
            else console.log('OK');
        });
    });
}

function insertUniversities() {
    const universities = [];

    require('./models/publications/University').insertMany(universities, {}, (err, res) => {
        if (err) console.log(err);
        else console.log('OK');
    });

}

function insertComments() {
    require('fs').readFile('uni.txt', (err, file) => {
        if (err) return;
        let data = [];
        String(file).split('\r\n').forEach(pub => {
            const d = pub.split(';');
            data.push({
                name: d[0],
                message: d[1],
                rate: d[2]
            });
        });

        require('./models/publications/Publications').find({}).exec(async (err, pubs) => {
            if(err) return;
            else {
                for(let p of pubs) {
                    for(let i = 0; i < data.length; i++) {
                        const c = data[i];
                        if(Math.floor(p.rate) == c.rate) {
                            p.comments.push(data[i]);
                        }
                    }

                    await p.save();
                }
            }
        });
    });
}

//insertPublications();
//insertUniversities();
//insertComments();

/*require('./models/publications/Publications').find({}).exec(async (err, pubs) => {
    if(err) return;
    else {
        for(let p of pubs){
            //p.rate = (Math.floor(Math.random() * (40) ) + 10) / 10;
            //p.downloads_count = Math.floor(Math.random() * (10000));
            //p.views_count = Math.floor(Math.random() * (100000));

            if(p.rate > 4) {
                p.is_potm = true;
                p.potm_date  = Date.now()
            }

            await p.save();
        }
    }
});*/

app.listen(process.env.PORT, () => console.log('Server runnig on PORT: ' + process.env.PORT));